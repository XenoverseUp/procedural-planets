async function getRepoStars(
  owner: string,
  repo: string,
): Promise<number | undefined> {
  const url = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`GitHub API returned an error: ${response.status}`);
    }

    const data: { stargazers_count: number } = await response.json();
    const stars = data.stargazers_count;

    return stars;
  } catch (error) {
    console.error("Error fetching repo data:", error);
    return undefined;
  }
}

export default getRepoStars;
