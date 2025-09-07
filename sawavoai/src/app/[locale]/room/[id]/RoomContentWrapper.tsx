"use client";

import React, { useEffect } from "react";
import { useTracks, useLocalParticipant } from "@livekit/components-react";
import { Track } from "livekit-client";
import { RoomLayout } from "../components/RoomLayout";

interface RoomContentProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isConnected: boolean;
  currentView: string;
  setCurrentView: (view: string) => void;
  roomId: string;
  userId?: string;
}

export default function RoomContentWrapper({
  videoRef,
  isConnected,
  currentView,
  setCurrentView,
  roomId,
  userId,
}: RoomContentProps) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const { localParticipant } = useLocalParticipant();

  // Auto-enable camera and microphone when connected
  useEffect(() => {
    let mounted = true;

    const enableMedia = async () => {
      if (!localParticipant || !mounted) return;

      try {
        // Check if participant exists and is ready before enabling devices
        if (localParticipant && localParticipant.identity) {
          // Enable camera
          if (!localParticipant.isCameraEnabled) {
            await localParticipant.setCameraEnabled(true);
          }
          // Enable microphone
          if (!localParticipant.isMicrophoneEnabled) {
            await localParticipant.setMicrophoneEnabled(true);
          }
          console.log("Camera and microphone enabled");
        }
      } catch (error) {
        // Don't log errors if component is unmounted
        if (mounted) {
          console.error("Failed to enable media devices:", error);
        }
      }
    };

    if (localParticipant) {
      // Add a small delay to ensure connection is established
      const timer = setTimeout(enableMedia, 1000);
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }

    return () => {
      mounted = false;
    };
  }, [localParticipant]);

  return (
    <RoomLayout
      videoRef={videoRef}
      isActive={isConnected}
      participants={[]}
      messages={[]}
      currentView={currentView}
      userId={userId}
      roomId={roomId}
      onSendMessage={() => {}}
      onViewChange={setCurrentView}
      tracks={tracks}
      localParticipant={localParticipant}
    />
  );
}
