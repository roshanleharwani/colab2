/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import useUserStore from "@/store/userStore";
import { toast } from "react-hot-toast";
import { join } from "path";
import { ExploreSidebar } from "@/components/explore/explore-sidebar";

// This would come from your database
interface project {
  _id: string;
  name: string;
}
interface User {
  _id: string;
  name: string;
}
interface JoinRequest {
  _id: string;
  projectId: project;
  FromUserId: User;
  message: string;
  role: string;
  createdAt: string;
}
const handleAction = async (
  action: string,
  requestId: string,
  fromUser: string
) => {
  try {
    const response = await fetch("/api/join-request", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestId,
        status: action,
        userId: fromUser,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed while updating reqeust");
    }
    toast.success(`Request ${action}ed successfully`);
  } catch (error) {
    toast.error("Failed to update request");
  }
};

const NotificationPage = () => {
  const [user, setUser] = useState("");
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  useEffect(() => {
    const userItem = localStorage.getItem("user");
    if (userItem) {
      const userId = JSON.parse(userItem);
      if (userId.length > 0) {
        setUser(userId);
      }
    }
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`/api/join-request?userId=${user}`);
        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        toast.error("Failed to fetch requests");
      }
    };
    fetchRequests();
  }, [user]);
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Join Requests</h1>
      <div className="space-y-4 flex gap-4">
        {requests.map((request) => (
          <Card key={request._id}>
            <CardHeader>
              <CardTitle className="text-lg">
                Request to join {request.projectId.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                  <AvatarFallback>{request.FromUserId.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{request.FromUserId.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">{request.message}</p>
              <div className="flex space-x-4">
                <Button
                  onClick={() => {
                    handleAction("accept", request._id, request.FromUserId);
                  }}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Handle reject request
                  }}
                >
                  Decline
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
