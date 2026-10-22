import { toast } from "react-toastify";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function submitScore(scoreData, token) {
  if (!token) return { success: false, reason: "unauthenticated" };

  try {
    const res = await fetch(`${API_BASE_URL}/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(scoreData),
    });

    if (res.status === 401) return { success: false, reason: "unauthorized" };

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to submit score");

    if (data.updated) {
      toast.success("🎉 Personal High Score registered to global leaderboard!");
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function reportRoundComplete(
  { mode, score, roundReached, timeTakenSeconds },
  token,
) {
  if (!token) return;
  const currentSeasonId = new Date().toISOString().slice(0, 7);

  try {
    await fetch(`${API_BASE_URL}/stats/round-complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mode, timeTakenSeconds }),
    });

    await fetch(`${API_BASE_URL}/stats/mode-achievement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mode,
        score,
        roundReached,
        seasonId: currentSeasonId,
      }),
    });
  } catch (err) {
    console.error("Failed to report round metrics:", err);
  }
}

export async function fetchUserProfileData(token) {
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/user/profile-data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Profile fetch error:", err.message);
    return null;
  }
}

export async function updateUserProfile({ firstName, lastName }, token) {
  if (!token) return { success: false };

  try {
    const res = await fetch(`${API_BASE_URL}/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ firstName, lastName }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update profile");

    toast.success("Profile name updated successfully!");
    return { success: true, data };
  } catch (err) {
    toast.error(err.message || "Error updating name");
    return { success: false, error: err.message };
  }
}

export async function fetchLeaderboard({ region, type, mode }) {
  try {
    const params = new URLSearchParams({
      region: region || "All Servers (Mixed)",
      type: type || "all",
      mode: mode || "expert",
    });

    const res = await fetch(`${API_BASE_URL}/leaderboard?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch leaderboard");
    return data.leaderboard || [];
  } catch (err) {
    return [];
  }
}

export async function fetchUserRank({ token, mode, region }) {
  if (!token) return null;

  try {
    const params = new URLSearchParams({ mode, region });
    const res = await fetch(`${API_BASE_URL}/user/rank?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) return null;

    const data = await res.json();
    if (!res.ok) return null;
    return data;
  } catch (err) {
    return null;
  }
}

export async function fetchHallOfFameArchives({ season_type, mode }) {
  try {
    const params = new URLSearchParams({ season_type, mode });
    const res = await fetch(
      `${API_BASE_URL}/leaderboard/archives?${params.toString()}`,
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch archives");
    return data.archives || [];
  } catch (err) {
    return [];
  }
}

export async function uploadProfilePicture(file) {
  const MAX_SIZE_BYTES = 3 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    toast.error("Image file size exceeds the 3 MB limit!");
    return null;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      toast.success("Profile picture updated successfully!");
      resolve(reader.result);
    };
    reader.onerror = () => {
      toast.error("Failed to process profile image.");
      resolve(null);
    };
    reader.readAsDataURL(file);
  });
}
