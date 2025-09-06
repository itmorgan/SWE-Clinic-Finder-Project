'use client'

import Link from "next/link"
import { ChevronRightIcon , TrashIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"

import React, { useState } from "react";
import PreviousMap from "postcss/lib/previous-map"
import { X } from "lucide-react"

const notifications = [
  {
    title: "Your call has been confirmed.",
    description: "1 hour ago",
  },
  {
    title: "You have a new message!",
    description: "1 hour ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },

]

type CardProps = React.ComponentProps<typeof Card>

const notificationsPerPage = 4;

export function CardDemo({ className, ...props }: CardProps) {

  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * notificationsPerPage;
  const endIndex = startIndex + notificationsPerPage;

  const currentNotifications = notifications.slice(startIndex, endIndex);

  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

  const handlePreviousPage = ()  =>{
    setCurrentPage((prevPage) => Math.max(prevPage-1,1))
  }

  const handleNextPage = () => {
    setCurrentPage((nextPage) => Math.min(nextPage+1, totalPages))
  }


  return (
    <div>
      <Card className={cn("w-[380px] h-[650px]")} {...props}>
        <CardHeader>
          <CardTitle>Updates</CardTitle>
        </CardHeader>
          {/* content in the card */}
          <CardContent className="grid gap-4 overflow-hidden  max-h-[700px]">
                <div>
                {currentNotifications.map((notification, index) => (
                    <div 
                        key={index}
                        className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0 flex items-center space-x-4 rounded-md border p-4"
                    >
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <div className="space-y-1">
                            
                            <div className="flex flex-col gap 4">
                              <X size= {16}/>
                              <p className="text-sm font-medium leading-none">
                                  {notification.title}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {notification.description}
                            </p>
                        </div>
                        <div style = {{display: 'flex',  margin: '10px', flexDirection: 'row'}}>
                            <div style = {{paddingRight:'30px'}}>
                                <Button>
                                    View Patient Info
                                    <ChevronRightIcon className="h-4 w-4" />
                                </Button>
                            </div>
                            <div>
                                <Button variant = "secondary">
                                    <TrashIcon className="h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
        </CardContent>
        
      </Card>
      
      <div className = "pb-10">
        {/* pagination part  */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={handlePreviousPage} />
            </PaginationItem>

            {[...Array(totalPages)].map((_, page) => (
            <PaginationItem key={page}>
              <PaginationLink href="#" onClick={() => setCurrentPage(page + 1)}>{page+1}</PaginationLink>
            </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem >
              <PaginationNext href="#" onClick={handleNextPage}/>
            </PaginationItem>
                        
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  ) 
}
