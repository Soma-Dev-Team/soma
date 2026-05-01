'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { logWeight, saveProfile } from '@/lib/db/repo';
import {
  ageFromBirthDate,
  macrosFromSplit,
  mifflinStJeor,
  targetCalories,
  tdee,
  type ActivityLevel,
  type Goal,
  type Pace,
  type Sex,
} from '@/lib/tdee';
import { kgToLbs, lbsToKg, inchesToCm } from '@/lib/utils';
import { GraphiteRing } from '@/components/soma-mark';

type Units = 'metric' | 'imperial';

interface Draft {
  units: Units;
  sex: Sex;
  birth_date: string;
  height_cm: number;
  weight_kg: number;
  goal: Goal;
  pace: Pace;
  activity: ActivityLevel;
  split: { p: number; c: number; f: number };
}

const TOTAL_STEPS = 6;

export default function OnboardingPage() {
  const t = useTranslations('onboarding');
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [d, setD] = useState<Draft>({
    units: 'metric',
    sex: 'male',
    birth_date: '1995-01-01',
    height_cm: 175,
    weight_kg: 75,
    goal: 'maintain',
    pace: 'moderate',
    activity: 'moderate',
    split: { p: 30, c: 40, f: 30 },
  });

  const update = (patch: Partial<Draft>) => setD((prev) => ({ ...prev, ...patch }));
  const back = () => setStep((s) => Math.max(1, s - 1));
  const next = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));

  const age = ageFromBirthDate(d.birth_date);
  const bmr = mifflinStJeor({ sex: d.sex, weightKg: d.weight_kg, heightCm: d.height_cm, age });
  const total = tdee({ bmr, activity: d.activity });
  const target = targetCalories({ tdee: total, goal: d.goal, pace: d.pace });
  const macros = macrosFromSplit(target, d.split);

  async function finish() {
    await saveProfile({
      sex: d.sex,
      birth_date: d.birth_date,
      height_cm: d.height_cm,
      activity_level: d.activity,
      goal: d.goal,
      goal_pace: d.pace,
      target_calories: target,
      target_protein_g: macros.protein_g,
      target_carbs_g: macros.carbs_g,
      target_fat_g: macros.fat_g,
      units: d.units,
      onboarded: true,
    });
    await logWeight(d.weight_kg);
    router.replace('/app');
  }

  return (
    <div className="max-w-md mx-auto">
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
        {t('step', { current: step, total: TOTAL_STEPS })}
      </p>
      <div className="h-1 rounded-full bg-border overflow-hidden mb-8">
        <div className="h-full bg-accent transition-all" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
      </div>

      <Card>
        <CardContent className="pt-6 pb-6">
          {step === 1 && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center pt-2">
                <GraphiteRing size={140} pct={0.75} weight="regular" />
              </div>
              <div>
                <div className="text-4xl wordmark text-foreground">{t('welcome_title').toLowerCase()}</div>
                <p className="text-muted-foreground mt-2">{t('welcome_sub')}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <UnitButton active={d.units === 'metric'} onClick={() => update({ units: 'metric' })}>
                  {t('units_metric')}
                </UnitButton>
                <UnitButton active={d.units === 'imperial'} onClick={() => update({ units: 'imperial' })}>
                  {t('units_imperial')}
                </UnitButton>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t('about_title')}</h2>
              <div className="grid grid-cols-3 gap-2">
                <UnitButton active={d.sex === 'male'} onClick={() => update({ sex: 'male' })}>
                  {t('sex_male')}
                </UnitButton>
                <UnitButton active={d.sex === 'female'} onClick={() => update({ sex: 'female' })}>
                  {t('sex_female')}
                </UnitButton>
                <UnitButton active={d.sex === 'other'} onClick={() => update({ sex: 'other' })}>
                  {t('sex_other')}
                </UnitButton>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bd">{t('birth_date')}</Label>
                <Input id="bd" type="date" value={d.birth_date} onChange={(e) => update({ birth_date: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('height')}</Label>
                {d.units === 'metric' ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={d.height_cm}
                      onChange={(e) => update({ height_cm: Number(e.target.value) })}
                    />
                    <span className="text-muted-foreground">cm</span>
                  </div>
                ) : (
                  <ImperialHeight cm={d.height_cm} onChange={(cm) => update({ height_cm: cm })} />
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t('weight_title')}</h2>
              {d.units === 'metric' ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={d.weight_kg}
                    onChange={(e) => update({ weight_kg: Number(e.target.value) })}
                  />
                  <span className="text-muted-foreground">kg</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={Number(kgToLbs(d.weight_kg).toFixed(1))}
                    onChange={(e) => update({ weight_kg: lbsToKg(Number(e.target.value)) })}
                  />
                  <span className="text-muted-foreground">lb</span>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t('goal_title')}</h2>
              <div className="grid grid-cols-3 gap-2">
                <UnitButton active={d.goal === 'lose'} onClick={() => update({ goal: 'lose' })}>
                  {t('goal_lose')}
                </UnitButton>
                <UnitButton active={d.goal === 'maintain'} onClick={() => update({ goal: 'maintain' })}>
                  {t('goal_maintain')}
                </UnitButton>
                <UnitButton active={d.goal === 'gain'} onClick={() => update({ goal: 'gain' })}>
                  {t('goal_gain')}
                </UnitButton>
              </div>
              {d.goal !== 'maintain' && (
                <div className="space-y-2 pt-2">
                  {(['mild', 'moderate', 'aggressive'] as const).map((p) => (
                    <UnitButton key={p} block active={d.pace === p} onClick={() => update({ pace: p })}>
                      {t(`pace_${p}`)}
                    </UnitButton>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold mb-3">{t('activity_title')}</h2>
              {(['sedentary', 'light', 'moderate', 'active', 'very_active'] as const).map((a) => (
                <UnitButton key={a} block active={d.activity === a} onClick={() => update({ activity: a })}>
                  {t(`activity_${a}`)}
                </UnitButton>
              ))}
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t('targets_title')}</h2>
              <div className="grid grid-cols-2 gap-3">
                <Stat label={t('tdee')} value={`${Math.round(total)}`} suffix="kcal" />
                <Stat label={t('target_calories')} value={`${target}`} suffix="kcal" />
              </div>
              <div className="pt-2">
                <Label>{t('split')} (P / C / F %)</Label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  <Input
                    type="number"
                    value={d.split.p}
                    onChange={(e) => update({ split: { ...d.split, p: Number(e.target.value) } })}
                  />
                  <Input
                    type="number"
                    value={d.split.c}
                    onChange={(e) => update({ split: { ...d.split, c: Number(e.target.value) } })}
                  />
                  <Input
                    type="number"
                    value={d.split.f}
                    onChange={(e) => update({ split: { ...d.split, f: Number(e.target.value) } })}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 num">
                  → {macros.protein_g}p / {macros.carbs_g}c / {macros.fat_g}f
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="ghost" onClick={back} disabled={step === 1}>
          {t('back')}
        </Button>
        {step < TOTAL_STEPS ? (
          <Button onClick={next}>{t('next')}</Button>
        ) : (
          <Button onClick={finish}>{t('finish')}</Button>
        )}
      </div>
    </div>
  );
}

function UnitButton({
  active,
  onClick,
  block,
  children,
}: {
  active: boolean;
  onClick: () => void;
  block?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-lg border px-3 py-2 text-sm transition-colors ${
        active ? 'border-accent bg-accent/10 text-foreground' : 'border-border hover:bg-muted/10'
      } ${block ? 'w-full' : ''}`}
    >
      {children}
    </button>
  );
}

function Stat({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold tracking-tight num mt-1">
        {value}
        {suffix && <span className="text-sm text-muted-foreground ml-1">{suffix}</span>}
      </div>
    </div>
  );
}

function ImperialHeight({ cm, onChange }: { cm: number; onChange: (cm: number) => void }) {
  const totalInches = cm / 2.54;
  const ft = Math.floor(totalInches / 12);
  const inch = Math.round(totalInches - ft * 12);
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={ft}
          onChange={(e) => onChange(inchesToCm(Number(e.target.value) * 12 + inch))}
        />
        <span className="text-muted-foreground">ft</span>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={inch}
          onChange={(e) => onChange(inchesToCm(ft * 12 + Number(e.target.value)))}
        />
        <span className="text-muted-foreground">in</span>
      </div>
    </div>
  );
}
