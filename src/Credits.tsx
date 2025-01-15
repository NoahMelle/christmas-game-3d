import { useEffect, useState } from "react";

export default function EmptyScene({
  setScene,
}: {
  setScene: (scene: number) => void;
}) {
  const [credits, setCredits] = useState<any[]>([]);

  useEffect(() => {
    fetch("/credits.json")
      .then((response) => response.json())
      .then((data) => setCredits(data))
      .catch((error) => console.error("Error fetching credits:", error));
  }, []);

  useEffect(() => {
    console.log(credits);
  }, [credits]);

  return (
    <>
      <div className="credits">
        <ul>
          {credits.map((credit, index) => (
            <li key={index}>
              <p className="credit-label">{credit.name}</p>
              <div>
                {credit.contributors.map(
                  (contributor: any, contributorIndex: number) => (
                    <p
                      className="contributor-label"
                      key={index + " - " + contributorIndex}
                    >
                      <a href={contributor.link} target="_blank">
                        {contributor.name}
                      </a>
                    </p>
                  )
                )}
              </div>
            </li>
          ))}
        </ul>
        <button onClick={() => setScene(0)}>
          <p>Back</p>
        </button>
      </div>
    </>
  );
}
