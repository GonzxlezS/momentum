import { useEffect, useMemo, useState } from "react";
import CountdownForm from "../../components/CountdownForm/CountdownForm.tsx";
import BottomSheet from "../../components/BottomSheet/BottomSheet.tsx";
import { CountdownDB } from "../../core/core.ts";
import { Countdown, type CountdownData } from "../../core/models/countdown.ts";
import CountdownCard from "../../components/CountdownCard/CountdownCard.tsx";

import styles from "./CountdownPage.module.css";

function CountdownPage() {
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCountdownData, setSelectedCountdownData] = useState<
    CountdownData | undefined
  >(undefined);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [descOrder, setDescOrder] = useState(false);

  const handleOpen = (data?: CountdownData) => {
    setSelectedCountdownData(data);
    setIsSheetOpen(true);
  };

  const handleClose = () => setIsSheetOpen(false);

  const handleOnSave = async (data: CountdownData) => {
    try {
      const newCountdown = new Countdown(data);
      const id = await CountdownDB.addCountdown(newCountdown);

      newCountdown.id = id;

      setCountdowns((prev) => [...prev, newCountdown]);
      handleClose();
    } catch (e: unknown) {
      console.error(e);
    }
  };

  const handleOnUpdate = async (data: CountdownData) => {
    try {
      const updatedCountdown = new Countdown(data);
      await CountdownDB.updateCountdown(updatedCountdown);

      setCountdowns((prev) =>
        prev.map((cd) => cd.id === updatedCountdown.id ? updatedCountdown : cd)
      );
      handleClose();
    } catch (e: unknown) {
      console.error(e);
    }
  };

  const handleOnDelete = async (id: number) => {
    try {
      await CountdownDB.delete(id);

      setCountdowns((prev) => prev.filter((cd) => cd.id !== id));

      handleClose();
    } catch (e: unknown) {
      console.error(e);

      // const errorMessage = e instanceof Error ? e.message : "Error de eliminación.";
      // showErrorSnackbar(errorMessage);
    }
  };

  const handleSortToggle = () => {
    setDescOrder((prev) => !prev);
  };

  const sortedCountdowns = useMemo(() => {
    return [...countdowns].sort((a, b) => {
      const daysA = a.daysLeft();
      const daysB = b.daysLeft();

      const isANegative = daysA < 0;
      const isBNegative = daysB < 0;

      if (isANegative && !isBNegative) {
        return 1;
      }

      if (isBNegative && !isANegative) {
        return -1;
      }

      return descOrder ? daysB - daysA : daysA - daysB;
    });
  }, [countdowns, descOrder]);

  useEffect(() => {
    const loadCountdowns = async () => {
      try {
        const data = await CountdownDB.getAllCountdown();
        setCountdowns(data);
      } catch (error) {
        console.error("Error al cargar los countdowns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCountdowns();
  }, []);

  const countdownList = () => {
    const len = countdowns.length;

    if (len === 0) {
      return <p style={{ textAlign: "center" }}>🔍❓🕳️</p>;
    }

    return (
      <>
        {len > 1 && (
          <button
            className={styles.sortBtn}
            type="button"
            onClick={handleSortToggle}
          >
            {descOrder ? "▼" : "▲"}
          </button>
        )}

        <div className={styles.countdownList}>
          {sortedCountdowns.map((cd) => (
            <div
              key={cd.id}
              onClick={() => handleOpen(cd.toIDBData())}
            >
              <CountdownCard
                data={cd.toIDBData()}
                daysLeft={cd.daysLeft()}
                textColor={cd.textColor()}
              />
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <h1 className={styles.countdownListTitle}>Countdowns</h1>

      {isLoading ? <div style={{ textAlign: "center" }}>🔍...⏳</div> : (
        countdownList()
      )}

      <button
        type="button"
        className={styles.addBtn}
        onClick={() => handleOpen()}
      >
        +
      </button>

      <BottomSheet isOpen={isSheetOpen} onClose={handleClose}>
        <CountdownForm
          key={selectedCountdownData ? selectedCountdownData.id : "new"}
          data={selectedCountdownData}
          onSave={handleOnSave}
          onUpdate={handleOnUpdate}
          onDelete={handleOnDelete}
          onDiscard={handleClose}
        />
      </BottomSheet>
    </>
  );
}

export default CountdownPage;
