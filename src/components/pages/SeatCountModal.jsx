import React, { useEffect } from "react";

const SeatCountModal = ({
  isOpen,
  onClose,
  onConfirm,
  selectedSeats,
  setSelectedSeats,
}) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* BACKDROP – softer blur, more visibility */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="relative bg-white rounded-2xl w-[420px] p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-sky-600 text-center">
            How many seats?
          </h2>

          {/* SEAT GRID */}
          <div className="grid grid-cols-5 gap-4 mt-8 justify-items-center">
            {Array.from({ length: 10 }).map((_, i) => {
              const count = i + 1;
              const isSelected = selectedSeats === count;

              return (
                <button
                  key={count}
                  onClick={() => setSelectedSeats(count)}
                  className={`w-14 h-14 rounded-lg border text-lg font-medium transition
                    ${
                      isSelected
                        ? "bg-sky-600 text-white border-sky-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-sky-400"
                    }`}
                >
                  {count}
                </button>
              );
            })}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between gap-4 mt-10">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg border text-gray-400 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              disabled={!selectedSeats}
              onClick={onConfirm}
              className={`flex-1 py-3 rounded-lg font-medium transition
                ${
                  selectedSeats
                    ? "bg-sky-600 text-white hover:bg-sky-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              Select seats
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeatCountModal;
