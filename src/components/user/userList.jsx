import ShowList from "./drinkList";

export default function userList() {
  return (
    <div className="bg-gradient-to-br from-gray-100 to-green-100 w-full min-h-screen px-2 sm:px-4 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto">
        <ShowList />
      </div>
    </div>
  );
}
