import { useAuth } from "@/Contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import PageSkeleton from "@/Components/skeletons/PageSkeleton";
import { api } from "@/utils/apiClient";
import { User } from "@/types/users";

import JourneyMap from "./journey/JourneyMap";
import LessonList from "./LessonList";

const LearnContainer = () => {
  const { authData } = useAuth();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", authData?.token],
    queryFn: async () => {
      const response = await api.get<User>("/api/users/");
      return response.data;
    },
    enabled: !!authData?.isLoggedIn && !!authData?.token,
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  // Default to map if not set
  const learningMode = user?.learning_mode || "map";

  return learningMode === "list" ? <LessonList /> : <JourneyMap />;
};

export default LearnContainer;
