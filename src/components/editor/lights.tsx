const Lights = () => (
  <>
    <ambientLight intensity={0.75} />
    <directionalLight color="white" position={[0, 5, 5]} />
  </>
);

export default Lights;
