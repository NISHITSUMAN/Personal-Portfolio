import React, { useEffect, useState } from "react";

const GithubProjects = ({ username }) => {
  const [repos, setRepos] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("newest");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos`);
        const data = await res.json();
        setRepos(data);
      } catch (error) {
        console.error("Error fetching GitHub repos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  const allLanguages = [
    "All",
    ...new Set(repos.map((repo) => repo.language).filter(Boolean))
  ];

  const sortRepos = (repos) => {
    switch (sortType) {
      case "oldest":
        return [...repos].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case "most-stars":
        return [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);
      case "fewest-stars":
        return [...repos].sort((a, b) => a.stargazers_count - b.stargazers_count);
      default:
        return [...repos].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  };

  const filteredRepos = repos
    .filter((repo) =>
      repo.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((repo) =>
      selectedLanguage === "All" || repo.language === selectedLanguage
    );

  const sortedRepos = sortRepos(filteredRepos);
  const displayedRepos = sortedRepos.slice(0, visibleCount);

  const toggleShowMore = () => {
    setVisibleCount((prev) =>
      prev === 6 ? sortedRepos.length : 6
    );
  };

  if (loading) return <p className="text-center mt-8">Loading GitHub projects...</p>;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-4 text-center">More Projects from GitHub</h2>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded shadow-sm text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="px-3 py-2 border rounded shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="most-stars">Most Stars</option>
          <option value="fewest-stars">Fewest Stars</option>
        </select>
      </div>

      {/* Language Tags */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {allLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedLanguage(lang)}
            className={`px-3 py-1 rounded-full text-sm border transition-all ${
              selectedLanguage === lang
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {displayedRepos.map((repo) => (
          <div key={repo.id} className="bg-white shadow-md rounded-lg p-5">
            <h3 className="text-lg font-semibold">{repo.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{repo.description || "No description available."}</p>
            <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
              <span>⭐ {repo.stargazers_count}</span>
              <span>{repo.language || "Unknown"}</span>
              <span>{new Date(repo.created_at).toLocaleDateString()}</span>
            </div>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on GitHub →
            </a>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {sortedRepos.length > 6 && (
        <div className="text-center mt-6">
          <button
            onClick={toggleShowMore}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
          >
            {visibleCount === 6 ? "Show More" : "Show Less"}
          </button>
        </div>
      )}
    </div>
  );
};

export default GithubProjects;
