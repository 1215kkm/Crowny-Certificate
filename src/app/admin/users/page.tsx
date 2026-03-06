"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import {
  getDocuments,
  updateDocument,
  Timestamp,
  type UserDoc,
  type UserRole,
} from "@/lib/firestore";
import { formatTimestamp } from "@/lib/grade-utils";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (authLoading || !isAdmin) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const userDocs = await getDocuments<UserDoc>("users");
        setUsers(
          userDocs.map((u) => ({
            id: u.id,
            name: u.name || "이름 미설정",
            email: u.email,
            role: u.role,
            createdAt: formatTimestamp(u.createdAt),
          }))
        );
      } catch (error) {
        console.error("회원 목록 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isAdmin, authLoading]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateDocument("users", userId, {
        role: newRole,
        updatedAt: Timestamp.now(),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      console.error("역할 변경 실패:", error);
      alert("역할 변경에 실패했습니다.");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAdmin && !authLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">접근 권한이 없습니다</h1>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block"
        >
          &larr; 대시보드
        </Link>
        <h1 className="text-2xl font-bold">회원 관리</h1>
      </div>

      {/* 검색 */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이름 또는 이메일로 검색..."
          className="w-full max-w-md px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      ) : (
        <>
          <div className="text-sm text-muted-foreground mb-3">
            총 {filteredUsers.length}명
          </div>
          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-medium">이름</th>
                  <th className="text-left p-4 font-medium">이메일</th>
                  <th className="text-left p-4 font-medium">역할</th>
                  <th className="text-left p-4 font-medium">가입일</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-muted-foreground"
                    >
                      {search
                        ? "검색 결과가 없습니다."
                        : "등록된 회원이 없습니다."}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t border-border hover:bg-muted/50"
                    >
                      <td className="p-4 font-medium">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(
                              user.id,
                              e.target.value as UserRole
                            )
                          }
                          className="px-2 py-1 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="STUDENT">학생</option>
                          <option value="INSTRUCTOR">강사</option>
                          <option value="ADMIN">관리자</option>
                        </select>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {user.createdAt}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
