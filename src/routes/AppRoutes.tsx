import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/Home/HomePage';
import { MoonPage } from '@/pages/Moon/MoonPage';
import { MarsPage } from '@/pages/Mars/MarsPage';
import { DeepSpacePage } from '@/pages/DeepSpace/DeepSpacePage';
import { EquipmentPage } from '@/pages/Equipment/EquipmentPage';
import { NotFound } from '@/components/common/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* 1. Earth / Home Landing Hub */}
        <Route path="/" element={<HomePage />} />

        {/* 2. Moon Exploration Environment */}
        <Route path="/moon" element={<MoonPage />} />

        {/* 3. Mars Exploration Environment */}
        <Route path="/mars" element={<MarsPage />} />

        {/* 4. Deep Space Exploration Environment */}
        <Route path="/deep-space" element={<DeepSpacePage />} />

        {/* 5. Reusable Dynamic Equipment Detail Page */}
        <Route path="/equipment/:id" element={<EquipmentPage />} />

        {/* 6. Catch-all fallback route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
