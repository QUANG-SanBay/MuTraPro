import NotificationItem from "./NotificationItem";

export default function NotificationList({ items = [] }) {
  if (!items.length) return <p>Chưa có thông báo.</p>;
  return (
    <ul style={{ padding: 0, margin: 0 }}>
      {items.map((n) => (
        <NotificationItem key={n.id || `${n.title}-${Math.random()}`} n={n} />
      ))}
    </ul>
  );
}
