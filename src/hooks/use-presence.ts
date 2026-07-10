import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

/**
 * Global online-presence hook. Joins the `presence:global` Realtime channel when the user is signed in
 * and exposes the set of user_ids currently online.
 */
export function usePresence() {
  const { user } = useAuth();
  const [onlineIds, setOnlineIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      setOnlineIds(new Set());
      return;
    }
    const channel = supabase.channel("presence:global", {
      config: { presence: { key: user.id } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setOnlineIds(new Set(Object.keys(state)));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ user_id: user.id, joined_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    onlineIds,
    onlineCount: onlineIds.size,
    isOnline: (id: string) => onlineIds.has(id),
  };
}
