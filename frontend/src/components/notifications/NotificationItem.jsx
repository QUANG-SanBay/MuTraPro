import styles from "./NotificationItem.module.scss";

export default function NotificationItem({ n }) {
  const created = n.createdAt || n.created_at || new Date().toISOString();
  return (
    <li className={styles.item}>
      <div className={styles.head}>
        <strong>{n.title}</strong>
        <small className={styles.time}>{new Date(created).toLocaleString()}</small>
      </div>
      <p className={styles.msg}>{n.message}</p>
      <div className={styles.meta}>
        to: <code>{n.recipient}</code> • channel: <b>{n.channel}</b> • id: {n.id}
      </div>
    </li>
  );
}
