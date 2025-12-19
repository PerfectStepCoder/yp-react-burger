import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import { useSelector } from '../../hooks/useRedux';
import styles from './BurgerIngredients.module.css';
import Ingredient from '../Ingredient/Ingredient';
import { Ingredient as IngredientType } from '../../utils/types';

const TABS = [
  { value: 'bun', label: 'Булки' },
  { value: 'sauce', label: 'Соусы' },
  { value: 'main', label: 'Начинки' },
] as const;

type TabValue = typeof TABS[number]['value'];

const BurgerIngredients: React.FC = () => {
  const ingredients = useSelector((state: any) => state.ingredients.items as IngredientType[]);
  const [activeTab, setActiveTab] = useState<TabValue>(TABS[0].value);
  const containerRef = useRef<HTMLDivElement>(null);
  const bunsRef = useRef<HTMLDivElement>(null);
  const saucesRef = useRef<HTMLDivElement>(null);
  const mainsRef = useRef<HTMLDivElement>(null);
  const buns = useMemo(
    () => ingredients.filter((i) => i.type === 'bun'),
    [ingredients],
  );
  const sauces = useMemo(
    () => ingredients.filter((i) => i.type === 'sauce'),
    [ingredients],
  );
  const mains = useMemo(
    () => ingredients.filter((i) => i.type === 'main'),
    [ingredients],
  );

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const containerTop = container.getBoundingClientRect().top;
    const sections = [
      { value: 'bun' as const, ref: bunsRef },
      { value: 'sauce' as const, ref: saucesRef },
      { value: 'main' as const, ref: mainsRef },
    ];

    const distances = sections
      .filter(({ ref }) => ref.current)
      .map(({ value, ref }) => ({
        value,
        distance: Math.abs(ref.current!.getBoundingClientRect().top - containerTop),
      }));

    if (distances.length === 0) {
      return;
    }

    const closest = distances.reduce((prev, curr) =>
      curr.distance < prev.distance ? curr : prev,
    );

    if (closest.value !== activeTab) {
      setActiveTab(closest.value);
    }
  }, [activeTab]);

  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) {
      return undefined;
    }

    handleScroll();
    scrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <section className={`${styles.wrapper} pt-10 pb-10`}>
      <div className="text text_type_main-large mb-5">Соберите бургер</div>

      <div className={`${styles.tabs} mb-6`}>
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            active={activeTab === tab.value}
            onClick={() => {}}
          >
            {tab.label}
          </Tab>
        ))}
      </div>

      <div className={`${styles.scrollContainer} custom-scroll`} ref={containerRef}>
        <div className={styles.section} id="section-buns" ref={bunsRef}>
          <h2 className="text text_type_main-medium mb-6">Булки</h2>
          <ul className={`${styles.list} pr-4 mb-10`}>
            {buns.map((item) => (
              <li key={item._id}>
                <Ingredient ingredient={item} />
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.section} id="section-sauces" ref={saucesRef}>
          <h2 className="text text_type_main-medium mb-6">Соусы</h2>
          <ul className={`${styles.list} pr-4 mb-10`}>
            {sauces.map((item) => (
              <li key={item._id}>
                <Ingredient ingredient={item} />
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.section} id="section-mains" ref={mainsRef}>
          <h2 className="text text_type_main-medium mb-6">Начинки</h2>
          <ul className={`${styles.list} pr-4`}>
            {mains.map((item) => (
              <li key={item._id}>
                <Ingredient ingredient={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default BurgerIngredients;
