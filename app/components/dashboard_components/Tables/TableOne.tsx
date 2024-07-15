import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Station {
  id: number;
  name: string;
  location: string;
  nozzleIdentifierName: string;
  pumps: {
    [key: string]: {
      nozzles: {
        id: string;
        label: string;
      }[];
      rdgIndex: string;
    };
  };
  client: {
    id: number;
  };
}

const TableOne = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [showAll, setShowAll] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchStations = async () => {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      try {
        const response = await fetch(`${apiBaseUrl}/clients/2/stations`);
        const data: Station[] = await response.json();
        setStations(data);
      } catch (error) {
        console.error("Failed to fetch stations", error);
      }
    };

    fetchStations();
  }, []);

  const displayedStations = showAll ? stations : stations.slice(0, 5);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Station Details
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              STATION ID
            </h5>
          </div>
          <div className="p-2.5 text-start xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              NAME
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              LOCATION
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              NUMBER OF PUMPS
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              NOZZLE IDENTIFIER
            </h5>
          </div>
        </div>

        {displayedStations.map((station) => (
          <div
            className="grid grid-cols-5 border-b border-stroke dark:border-strokedark"
            key={station.id}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{station.id}</p>
            </div>

            <div className="flex items-start justify-start p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{station.name}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{station.location}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">
                {Object.keys(station.pumps).length}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">
                {station.nozzleIdentifierName}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => router.push("/manage_stations")}
        >
          Show All Details
        </button>
      </div>
    </div>
  );
};

export default TableOne;
