const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function generateProfileSlug(firstName = "", lastName = "") {
  const cleanFirst = firstName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const cleanLast = lastName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const base = `${cleanFirst}-${cleanLast}`.replace(/^-+|-+$/g, "");
  return base || "gamer-profile";
}

/**
 * Fetch authenticated user's private profile data from backend
 */
export async function fetchUserProfileData(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching user profile data:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch public profile details by profile URL slug (No Auth Required)
 */
export async function fetchPublicProfileBySlug(slug) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/public/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching public profile:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Update authenticated user's profile details (First Name, Last Name, Profile URL)
 */
export async function updateUserProfile(data, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        firstName: data.firstName || data.first_name || "",
        lastName: data.lastName || data.last_name || "",
        profileUrl:
          data.profileUrl ||
          data.profile_url ||
          generateProfileSlug(
            data.firstName || data.first_name,
            data.lastName || data.last_name,
          ),
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error updating user profile:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Upload profile avatar image
 */
export async function uploadProfilePicture(file, token) {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result;

        if (token) {
          try {
            await fetch(`${API_BASE_URL}/api/user/avatar`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ avatar: base64Data }),
            });
          } catch (e) {
            console.warn(
              "Avatar upload to server failed, using local base64 fallback.",
            );
          }
        }
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  } catch (err) {
    console.error("Error uploading profile picture:", err);
    return null;
  }
}

/**
 * Submit game round score to server leaderboard
 */
export async function submitScore(scoreData, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mode: scoreData.mode,
        score: scoreData.score,
        region: scoreData.region,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error submitting score:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Sync offline/localStorage scores when logging in
 */
export async function syncLocalScoresToServer(scoresMap, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scores/sync-local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ localScores: scoresMap }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error syncing local scores to server:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch top leaderboard entries for a given region, mode, and timeline type
 */
export async function fetchLeaderboard({
  region = "Asia",
  mode = "easy",
  type = "all",
  limit = 100,
} = {}) {
  try {
    const query = new URLSearchParams({ region, mode, type, limit }).toString();
    const response = await fetch(`${API_BASE_URL}/api/leaderboard?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    return { success: false, leaderboard: [] };
  }
}

export const getLeaderboard = fetchLeaderboard;

/**
 * Fetch individual authenticated user rank
 */
export async function getUserRank(token, region = "Asia", mode = "easy") {
  try {
    const query = new URLSearchParams({ region, mode }).toString();
    const response = await fetch(`${API_BASE_URL}/api/user/rank?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching user rank:", err);
    return { success: false, rank: "UNRANKED" };
  }
}

/**
 * Fetch overall Hall of Fame all-time top scores
 */
export async function fetchHallOfFame() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/leaderboard/halloffame`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching Hall of Fame:", err);
    return { success: false, hallOfFame: [] };
  }
}
