import { type FC } from 'react';

type Props = {
  uuids: string[];
  copied: boolean[];
  handleCopy: (index: number) => void;
};

const UuidContainer: FC<Props> = ({ uuids, copied, handleCopy }) => {
  if (!uuids.length) return null;

  return (
    <div className="gird-cols-1 grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
      {uuids.map((uuid, index) => (
        <div key={uuid} className="flex flex-col items-center gap-4">
          <button
            disabled={copied[index]}
            onClick={() => handleCopy(index)}
            className="w-fit rounded-xl bg-white px-4 py-3 text-lg font-bold text-black disabled:cursor-not-allowed disabled:opacity-60 md:text-xl"
          >
            {uuid}
          </button>
        </div>
      ))}
    </div>
  );
};

export default UuidContainer;
