import { useEffect, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import CreateContentModal from "../components/CreateContentModal";
import PlusIcon from "../icons/PlusIcon";
import ShareIcon from "../icons/ShareIcon";
import Sidebar from "../components/Sidebar";
import { useContent } from "../hooks/useContent";
import { BACKEND_URL } from "../config";
import axios from "axios";

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { content, refresh } = useContent();

  useEffect(() => {
    refresh();
  }, [modalOpen]);
  return (
    <div>
      <Sidebar></Sidebar>
      <div className="p-4 ml-72 min-h-screen bg-gray-100">
        <CreateContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        ></CreateContentModal>
        <div className="flex justify-end gap-4 pb-4">
          <Button
            onClick={async () => {
              const response = await axios.post(
                `${BACKEND_URL}/api/v1/brain/share`,
                { share: true },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              const url = response.data.link;
              console.log(url);
              navigator.clipboard.writeText(url)
              alert("share url copied");
            }}
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
        <div className="flex flex-wrap gap-4">
          {content.map(({ type, link, title }) => (
            <Card type={type} link={link} title={title}></Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
