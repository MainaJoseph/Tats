import Loader from "../Loader";
import DefaultLayout from "./Layouts/DefaultLayout";

const Loading = () => {
  return (
    <>
      <DefaultLayout>
        <Loader />;
      </DefaultLayout>
    </>
  );
};

export default Loading;
