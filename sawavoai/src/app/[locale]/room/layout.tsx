import { ReactNode } from "react";

interface RoomLayoutProps {
  children: ReactNode;
}

export default function RoomLayout({ children }: RoomLayoutProps) {
  // Keep this layout minimal and avoid importing third-party CSS here.
  // Load LiveKit styles on the client only inside the room page when needed.
  return <>{children}</>;
}
