"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateSnapPixel } from "./actions";

type AppItem = {
  id: string;
  name: string;
  description: string;
  isConnected: boolean;
};

export function AppsClientList({ apps }: { apps: AppItem[] }) {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async (app: AppItem) => {
    if (app.id === "snap") {
      const pixelId = prompt("Enter your Snapchat Pixel ID:");
      if (pixelId) {
        setConnecting(true);
        try {
          await updateSnapPixel(pixelId);
          toast.success("Snapchat Pixel connected successfully.");
        } catch (e) {
          toast.error("Couldn't save your Snapchat Pixel ID. Please try again.");
        }
        setConnecting(false);
      }
    } else {
      toast.message(`${app.name} integration is not available in demo mode yet.`);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {apps.map((app) => (
        <div key={app.name} className="rounded-2xl border border-forest/10 p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-forest">{app.name}</p>
            {app.isConnected && (
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-600">
                Connected
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-forest/60">{app.description}</p>
          <Button
            variant="outline"
            className="mt-4 rounded-full"
            onClick={() => handleConnect(app)}
            disabled={connecting}
          >
            {app.isConnected ? "Manage" : "Connect"}
          </Button>
        </div>
      ))}
    </div>
  );
}
