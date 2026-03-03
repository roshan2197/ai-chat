import axios from "axios";
import { useState } from "react";

export default function Dropdown() {
  const [options, setOptions] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] =
    useState<Record<string, string>>();

  const fetchData = () => {
    if (options.length) return;

    setLoading(() => true);

    setTimeout(() => {
      axios
        .get("https://jsonplaceholder.typicode.com/posts")
        .then((response) => {
          setLoading(() => false);
          const list = response.data.map((d: Record<string, string>) => ({
            value: d.id,
            label: d.title.slice(0, 20),
          }));

          setOptions(() => list);
        })
        .catch(() => {
          setLoading(() => false);
        });
    }, 0);
  };

  const selectOption = (option: Record<string, string>) => {
    setSelectedOption(() => option);
    setShowDropdown(() => false);
  };

  return (
    <>
      {loading && (
        <p className="absolute top-0 left-0 z-[2] w-screen h-screen flex justify-center bg-gray-500">
          Loading Content
        </p>
      )}
      <div className="flex flex-col relative">
        <input
          className="border border-black rounded-md px-2 py-1"
          type="text"
          value={selectedOption?.label || ""}
          onClick={() => {
            setShowDropdown(() => true);
            fetchData();
          }}
        />
        {showDropdown &&
          (options.length ? (
            <div className="relative max-h-[400px] h-[400px]">
              <div className="absolute inset-x-0 top-0 z-[2] max-w-[400px] max-h-full flex flex-col overflow-y-auto border cursor-pointer py-2 px-2 divide-y bg-white ">
                {options.map((option) => (
                  <span
                    key={option.value}
                    className="p-1 hover:bg-gray-200 rounded-md"
                    onClick={() => selectOption(option)}>
                    {option.label}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p>No data found</p>
          ))}
      </div>
    </>
  );
}
