import { prisma, withRetry } from "@/lib/db";
import { Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRoleUpdater } from "@/components/admin/user-role-updater";

async function getUsers() {
  return withRetry(() =>
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { orders: true } } },
    })
  );
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <p className="text-[14px] text-dust-grey-400">
        {users.length} user{users.length !== 1 ? "s" : ""}
      </p>

      <div className="p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04]">
        <div className="rounded-[calc(1.5rem-3px)] bg-white overflow-hidden">
          {users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead className="pr-6">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-dust-grey-50/50 transition-colors duration-300"
                  >
                    <TableCell className="pl-6">
                      <p className="text-[13px] font-medium text-dust-grey-900">
                        {user.name || "No name"}
                      </p>
                      <p className="text-[11px] text-dust-grey-400">
                        {user.email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <UserRoleUpdater
                        userId={user.id}
                        currentRole={user.role}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-[13px] text-dust-grey-600">
                      {user._count.orders}
                    </TableCell>
                    <TableCell className="pr-6 text-[13px] text-dust-grey-400">
                      {user.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-20 text-center">
              <Users
                className="h-12 w-12 text-dust-grey-200 mx-auto mb-3"
                strokeWidth={1.5}
              />
              <p className="text-[14px] text-dust-grey-400">No users yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
