import { useUser } from '@/stores/user';
import { Button } from '@/components/ui/button';

export function Home() {
  const user = useUser((state) => state.user);
  const increase = useUser((state) => state.increasePopulation);

  return (
    <div>
      {user}
      <Button onClick={increase}>Click me</Button>
    </div>
  );
}
