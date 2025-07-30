import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { searchApi } from "../../api/searchApi";
import type { SearchResponse } from "../../types/search.ts";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(
    null
  );

  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (query.trim()) {
      handleSearch(query);
    }
  }, [query]);

  const handleSearch = async (searchQuery: string) => {
    const results = await searchApi({ query: searchQuery });
    setSearchResults(results);
  };

  return (
    <div>
      <h1>검색 페이지</h1>
      <p>검색어: {query}</p>

      {searchResults && (
        <div>
          <h2>응답 데이터:</h2>
          <pre>{JSON.stringify(searchResults, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
