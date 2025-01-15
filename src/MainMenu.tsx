export default function EmptyScene({
  setScene,
}: {
  setScene: (scene: number) => void;
}) {
  return (
    <>
      <div className="main-menu">
        <h1>GAME NAME</h1>
        <button onClick={() => setScene(2)}>
          <p>Play</p>
        </button>
        <button onClick={() => setScene(1)}>
          <p>Credits</p>
        </button>
      </div>
    </>
  );
}
