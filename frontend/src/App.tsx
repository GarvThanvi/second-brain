import Button from "./components/ui/Button";
import PlusIcon from "./icons/PlusIcon.tsx";
import ShareIcon from "./icons/ShareIcon.tsx";

const App = () => {
  return (
    <div className="[&>*]:mb-2">
      <Button variant="secondary" text="Share Brain" size="sm" startIcon={<ShareIcon size="sm"/>}></Button>
      <Button
        variant="primary"
        text="Add Content"
        size="md"
        startIcon={<PlusIcon size="md"></PlusIcon>}
      ></Button>
      <Button
        variant="primary"
        text="Add Content"
        size="lg"
        startIcon={<PlusIcon size="lg"></PlusIcon>}
      ></Button>
    </div>
  );
};

export default App;
