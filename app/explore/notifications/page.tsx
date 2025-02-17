"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import useUserStore from "@/store/userStore";
import {toast} from "react-hot-toast";
import { join } from "path";
// This would come from your database
interface project{
  _id: string;
  name: string;
}
interface User{
  _id:string;
  name:string;
}
interface JoinRequest {
  _id: string;
  projectId:project;
  FromUserId:User;
  message:string;
  role:string;
  createdAt: string;
}

const NotificationPage = () => {

  const [user,setUser]=useState("");
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  useEffect(()=>{
    const userItem = localStorage.getItem("user");
    if (userItem) {
      const userId = JSON.parse(userItem);
      if (userId.length > 0) {
        console.log("user id is available")
        setUser(userId);
      }
    }
  },[])

  useEffect(() => {

    const fetchRequests = async () => {
      try {
        console.log(user);
        const response = await fetch(`/api/join-request?userId=67b15c87f8dc079eb29e9732`);
        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }
        const data = await response.json();
        setRequests(data);
      }catch(error){
        toast.error("Failed to fetch requests");
      }
      

    }
    fetchRequests();


  }, [])
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Join Requests</h1>
      <div className="space-y-4">
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
                    // Handle accept request
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
}

export default NotificationPage;
