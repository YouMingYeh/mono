'use client';

export function MyGreetingMessage() {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  // Determine greeting based on time of day
  const getGreeting = () => {
    if (currentHour >= 5 && currentHour < 12) {
      return 'Good morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      return 'Good afternoon';
    } else if (currentHour >= 17 && currentHour < 21) {
      return 'Good evening';
    } else {
      return 'Good night';
    }
  };

  const greeting = getGreeting();

  return (
    <main className="flex flex-col items-start justify-center my-4">
      <h1 className="text-4xl font-light font-mono tabular-nums tracking-tight ">{greeting}!</h1>
      <br />
      <h2 className="text-xl font-light font-mono tabular-nums tracking-tight ">
        It&apos;s{' '}
        <strong className="font-bold">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
          {currentTime.toLocaleDateString()}
        </strong>
      </h2>

      <h3 className="text-lg font-light font-mono tabular-nums tracking-tight ">
        How are you doing today?
      </h3>
    </main>
  );
}
