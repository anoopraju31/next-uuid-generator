'use client';

import { useEffect, useState, type FC } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

const GenerateSingleUUID: FC = () => {
  const [singleUuid, setSingleUuid] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setSingleUuid(uuidv4());
  }, []);

  const generateNewUuidClick = () => {
    try {
      const newUuid = uuidv4();

      setSingleUuid(newUuid);
    } catch (error) {
      console.error('Error generating UUID', error);
      toast.error('Error generating UUID');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(singleUuid);
      setCopied(true);
      setTimeout(() => setCopied(false), 500); // Reset after 0.5 seconds
    } catch (err) {
      console.error('Failed to copy!', err);
      toast.error('Failed to copy!');
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 bg-black px-4 py-16 sm:px-6 md:px-8">
      <div className="item-center flex w-full justify-center">
        <h1 className="text-center text-3xl font-bold text-white"> Online UUID Generator </h1>
      </div>

      <div className="flex w-full flex-col items-center gap-6 md:w-fit">
        <h2 className="w-full text-left text-2xl font-semibold">Your Version 4 UUID: </h2>

        <div className="flex flex-col items-center gap-6 lg:flex-row">
          <button
            onClick={handleCopy}
            disabled={copied}
            className="w-full cursor-pointer rounded-xl bg-white px-4 py-3 text-lg font-bold text-black disabled:cursor-not-allowed disabled:opacity-60 md:w-fit md:px-6 md:py-6 md:text-xl"
          >
            {singleUuid}
          </button>

          <button
            onClick={generateNewUuidClick}
            className="w-full rounded-xl bg-white px-4 py-3 text-lg font-bold text-black md:w-fit md:px-6 md:py-6 md:text-xl"
          >
            Click here to generate another UUID.
          </button>
        </div>
      </div>
    </section>
  );
};

export default GenerateSingleUUID;
