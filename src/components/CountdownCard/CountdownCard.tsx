import type { CountdownData } from "../../core/models/countdown.ts";

import styles from "./CountdownCard.module.css";

type CountdownCardProps = {
  data: CountdownData;
  daysLeft: number;
  textColor: string;
};

function CountdownCard(props: CountdownCardProps) {
  const { data, daysLeft, textColor } = props;

  const daysLeftAbs = Math.abs(daysLeft);

  const daysLabelText = `${daysLeftAbs > 1 ? "days" : "day"}${
    daysLeft < 0 ? " ago" : ""
  }`;

  const contentLeftSide = () => {
    if (daysLeftAbs === 0) {
      return <strong>TODAY</strong>;
    }

    return (
      <div className={styles.countdownCardDaysContent}>
        <span className={styles.countdownCardDaysleft}>{daysLeftAbs}</span>
        <span className={styles.countdownCardDaysLabel}>{daysLabelText}</span>
      </div>
    );
  };

  return (
    <div
      className={styles.countdownCard}
      style={{ background: data.color, color: textColor }}
    >
      <div className={styles.countdownCardRight}>
        <span className={styles.countdownCardEmoji}>{data.emoji}</span>
        <div className={styles.countdownCardDetails}>
          <span className={styles.countdownCardName}>{data.name}</span>
          <span className={styles.countdownCardDate}>
            {data.date.toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            })}
          </span>
        </div>
      </div>

      <div className={styles.countdownCardLeft}>{contentLeftSide()}</div>
    </div>
  );
}

export default CountdownCard;
