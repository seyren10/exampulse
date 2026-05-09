function App() {
  const mode = import.meta.env.VITE_API_URL;
  return (
    <section className="container bg-red-500 mx-auto">
      <div>ExamPulse is running on {mode}</div>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptate quas
        illum sunt numquam enim alias eius facere sed, rem, cupiditate cum ea
        delectus ipsa. Iste officiis odio asperiores molestiae ut.
      </p>
    </section>
  );
}

export default App;
