import Button from "../components/Button";
import Input from "../components/Input";

const Signup = () => {
  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-xl border border-slate-200 min-w-48 p-8">
        <Input placeholder="Username"></Input>
        <Input placeholder="Password"></Input>
        <div className="flex justify-center pt-4">
          <Button variant="primary" text="Signup" fullWidth={true}></Button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
