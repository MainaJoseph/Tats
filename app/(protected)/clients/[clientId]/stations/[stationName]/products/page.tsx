import DefaultLayout from "@/app/components/dashboard_components/Layouts/DefaultLayout";
import StationProducts from "./station-products";

const StationProductsPage = () => {
  return (
    <div>
      <DefaultLayout>
        <StationProducts />
      </DefaultLayout>
    </div>
  );
};

export default StationProductsPage;
