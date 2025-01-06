import { createFileRoute } from "@tanstack/react-router";
import LoginGithub from "../components/login-github";
import LoginGoogle from "../components/login-google";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [selectedItem, setSelectedItem] = useState<"github" | "google">(
    "github"
  );
  useEffect(() => {
    const selectedItem = localStorage.getItem("selectedItem") as
      | "github"
      | "google";
    if (selectedItem) {
      setSelectedItem(selectedItem);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("selectedItem", selectedItem);
  }, [selectedItem]);
  return (
    <>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <button
          style={{
            backgroundColor:
              selectedItem === "github" ? "lightGreen" : "lightgray",
          }}
          onClick={() => setSelectedItem("github")}
        >
          Github
        </button>
        <button
          style={{
            backgroundColor:
              selectedItem === "google" ? "lightGreen" : "lightgray",
          }}
          onClick={() => setSelectedItem("google")}
        >
          Google
        </button>
      </nav>
      {selectedItem === "github" && (
        <article>
          <h2>Github example</h2>
          <LoginGithub />
        </article>
      )}
      {selectedItem === "google" && (
        <article>
          <h2>Google example</h2>
          <LoginGoogle />
        </article>
      )}
    </>
  );
}
