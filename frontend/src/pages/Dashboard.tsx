import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import CreateContentModal from "../components/CreateContentModal";
import PlusIcon from "../icons/PlusIcon";
import ShareIcon from "../icons/ShareIcon";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div>
      <Sidebar></Sidebar>
      <div className="p-4 ml-72 min-h-screen bg-gray-100">
        <CreateContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        ></CreateContentModal>
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            text="Share Brain"
            startIcon={<ShareIcon />}
          />
          <Button
            variant="primary"
            text="Add Content"
            startIcon={<PlusIcon />}
            onClick={() => setModalOpen(true)}
          />
        </div>
        <div className="flex gap-4">
          <Card
            type="twitter"
            link="https://x.com/zekkenVAL/status/1959049460115251263"
            title="Zekken The GOAT"
          ></Card>
          <Card
            type="youtube"
            link="https://youtu.be/2JzOe1Hs26Q?si=2aookOOuICviC3ci"
            title="Kirat Video"
          ></Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
