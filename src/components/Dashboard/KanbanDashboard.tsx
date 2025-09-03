"use client";

import React, { useState } from "react";
import {
  KanbanProvider,
  KanbanBoard,
  KanbanHeader,
  KanbanCards,
  KanbanCard,
} from "@/components/ui/shadcn-io/kanban";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { BuildingIcon } from "@/components/icons/BuildingIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import { cn } from "@/lib/utils";

// Define the property item type
interface PropertyItem {
  id: string;
  name: string;
  column: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  image?: string;
  status: "planned" | "sold" | "online";
  priority: "low" | "medium" | "high";
  [key: string]: unknown;
}

// Define the column type
interface PropertyColumn {
  id: string;
  name: string;
  color: string;
  count: number;
  [key: string]: unknown;
}

// Sample data
const initialColumns: PropertyColumn[] = [
  {
    id: "planned",
    name: "Planned",
    color: "bg-primary",
    count: 0,
  },
  {
    id: "sold",
    name: "Sold",
    color: "bg-green-600",
    count: 0,
  },
  {
    id: "online",
    name: "Online",
    color: "bg-orange-600",
    count: 0,
  },
];

const initialData: PropertyItem[] = [
  {
    id: "1",
    name: "Modern Downtown Apartment",
    column: "planned",
    price: "$450,000",
    location: "Downtown",
    bedrooms: 2,
    bathrooms: 2,
    area: "1,200 sq ft",
    status: "planned",
    priority: "high",
  },
  {
    id: "2",
    name: "Luxury Villa with Pool",
    column: "planned",
    price: "$850,000",
    location: "Beverly Hills",
    bedrooms: 4,
    bathrooms: 3,
    area: "3,500 sq ft",
    status: "planned",
    priority: "medium",
  },
  {
    id: "3",
    name: "Cozy Family Home",
    column: "sold",
    price: "$320,000",
    location: "Suburbs",
    bedrooms: 3,
    bathrooms: 2,
    area: "1,800 sq ft",
    status: "sold",
    priority: "low",
  },
  {
    id: "4",
    name: "Penthouse Suite",
    column: "online",
    price: "$1,200,000",
    location: "City Center",
    bedrooms: 3,
    bathrooms: 3,
    area: "2,800 sq ft",
    status: "online",
    priority: "high",
  },
  {
    id: "5",
    name: "Beachfront Condo",
    column: "online",
    price: "$650,000",
    location: "Ocean View",
    bedrooms: 2,
    bathrooms: 2,
    area: "1,500 sq ft",
    status: "online",
    priority: "medium",
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "medium":
      return "bg-orange-500/10 text-orange-600 border-orange-500/20";
    case "low":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const PropertyCard: React.FC<{ item: PropertyItem }> = ({ item }) => {
  return (
    <KanbanCard<PropertyItem> {...item}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-sm text-foreground line-clamp-2">
            {item.name}
          </h3>
          <Badge
            variant="outline"
            className={cn("text-xs", getPriorityColor(item.priority))}
          >
            {item.priority}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LocationIcon className="h-4 w-4" />
            <span>{item.location}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{item.bedrooms} bed</span>
            <span>{item.bathrooms} bath</span>
            <span>{item.area}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-lg text-foreground">
              {item.price}
            </span>
            <BuildingIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </KanbanCard>
  );
};

export default function KanbanDashboard() {
  const [data, setData] = useState<PropertyItem[]>(initialData);
  const [columns] = useState<PropertyColumn[]>(initialColumns);

  // Update column counts
  const updatedColumns = columns.map((column) => ({
    ...column,
    count: data.filter((item) => item.column === column.id).length,
  }));

  const handleDataChange = (newData: PropertyItem[]) => {
    setData(newData);
  };

  const addNewProperty = (columnId: string) => {
    const newProperty: PropertyItem = {
      id: `new-${Date.now()}`,
      name: "New Property",
      column: columnId,
      price: "$0",
      location: "Location",
      bedrooms: 0,
      bathrooms: 0,
      area: "0 sq ft",
      status: columnId as "planned" | "sold" | "online",
      priority: "medium",
    };
    setData([...data, newProperty]);
  };

  return (
    <>
      <div className="h-[calc(100vh-200px)]">
        <KanbanProvider<PropertyItem, PropertyColumn>
          columns={updatedColumns}
          data={data}
          onDataChange={handleDataChange}
          className="h-full"
        >
          {(column) => (
            <KanbanBoard key={column.id} id={column.id} className="h-full">
              <KanbanHeader className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className={cn("w-3 h-3 rounded-full", column.color)} />
                  <span className="font-semibold text-foreground">
                    {column.name}
                  </span>
                  <Badge variant="secondary" className="ml-2">
                    {column.count}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => addNewProperty(column.id)}
                  className="h-8 w-8 p-0"
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </KanbanHeader>

              <KanbanCards<PropertyItem> id={column.id} className="flex-1">
                {(item) => <PropertyCard key={item.id} item={item} />}
              </KanbanCards>
            </KanbanBoard>
          )}
        </KanbanProvider>
      </div>
    </>
  );
}
