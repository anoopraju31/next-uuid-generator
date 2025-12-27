import { type FC } from 'react';

import GenerateSingleUUID from './GenerateSingleUUID';
import GenerateMultipleUUID from './GenerateMultipleUUID';

const Home: FC = () => {
  return (
    <main className="flex w-full flex-col gap-8 font-mono lg:gap-12">
      <GenerateSingleUUID />
      <GenerateMultipleUUID />
    </main>
  );
};

export default Home;
