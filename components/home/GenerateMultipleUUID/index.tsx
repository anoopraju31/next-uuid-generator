'use client';

import { FormEvent, useState, type FC } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

import UuidContainer from './UuidContainer';

const GenerateMultipleUUID: FC = () => {
  const [count, setCount] = useState<number>(0);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean[]>([]);

  const handleCopy = async (index: number) => {
    try {
      if (copied[index]) return;
      await navigator.clipboard.writeText(uuids[index]);
      setCopied((prev) => prev.map((item, idx) => (idx === index ? true : item)));
    } catch (err) {
      console.error('Failed to copy!', err);
      toast.error('Failed to copy!');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (count <= 0 || count > 500) {
        toast.error('Please enter a valid number between 1 and 500');
        return;
      }

      const newUuids: string[] = [];
      const newCopied: boolean[] = [];

      for (let i = 0; i < count; i++) {
        const newUuid = uuidv4();
        newUuids.push(newUuid);
        newCopied.push(false);
      }

      setUuids(newUuids);
      setCopied(newCopied);
    } catch (error) {
      console.error('Error generating UUIDs', error);
      toast.error('Error generating UUIDs');
    }
  };

  return (
    <section className="flex w-full flex-col items-center gap-8 bg-white/10 px-4 py-12 sm:px-6 md:px-8 lg:px-12 lg:py-16 xl:px-16">
      <div className="item-center flex w-full justify-center">
        <h1 className="text-center text-3xl font-bold text-white"> Generator Multiple V4 UUIDs </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full flex-col items-end gap-6 sm:flex-row">
        <div className="flex w-full flex-col gap-3">
          <label htmlFor="count" className="text-lg font-bold text-white md:text-xl">
            Enter the number of UUIDs you want to generate
          </label>
          <input
            className="w-full rounded-xl bg-white px-4 py-3 text-xl font-bold text-black"
            type="number"
            id="count"
            min={1}
            max={500}
            placeholder="Enter a number"
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </div>

        <button type="submit" className="w-full rounded-xl bg-white px-4 py-3 text-xl font-bold text-black sm:w-fit">
          Generate
        </button>
      </form>

      <UuidContainer uuids={uuids} copied={copied} handleCopy={handleCopy} />
    </section>
  );
};

export default GenerateMultipleUUID;
