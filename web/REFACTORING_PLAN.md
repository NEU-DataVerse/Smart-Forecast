# Web Frontend Refactoring Plan

## 📋 Tổng quan

Tài liệu này mô tả kế hoạch tái cấu trúc toàn bộ code trong folder `/web` để cải thiện khả năng bảo trì, tái sử dụng và mở rộng.

## 🎯 Mục tiêu

1. **Tách component thành các phần nhỏ hơn** - Tuân theo Single Responsibility Principle
2. **Tổ chức code theo tính năng** - Feature-based folder structure
3. **Tạo shared components** - Tái sử dụng code tối đa
4. **Cải thiện type safety** - Sử dụng TypeScript hiệu quả
5. **Tối ưu performance** - Code splitting và lazy loading

## 📁 Cấu trúc hiện tại

```
web/src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx (Dashboard overview)
│   │   ├── layout.tsx (Layout với Header + Sidebar)
│   │   ├── alerts/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── statistics/page.tsx
│   │   ├── weather/page.tsx
│   │   └── disastermap/page.tsx
│   ├── login/
│   │   └── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx (Monolithic - 100+ lines)
│   ├── Sidebar.tsx (Monolithic - navigation logic)
│   ├── Loginfrom.tsx (Monolithic - 150+ lines)
│   ├── StatisticReportDialog.tsx (Complex dialog)
│   ├── PrintableStatisticReport.tsx
│   ├── dashboardUI/ (Dashboard components)
│   ├── alertsUI/ (Alert components)
│   ├── reportsUI/ (Report components)
│   ├── disasterUI/ (Disaster map components)
│   └── ui/ (shadcn/ui components)
├── context/
│   └── userContext.tsx
├── services/
│   ├── auth.ts
│   ├── axios.ts
│   └── data/ (API services)
├── hooks/
├── lib/
└── utils/
```

## 🎨 Cấu trúc mới được đề xuất

```
web/src/
├── app/                                 # Next.js App Router
│   ├── (auth)/                          # Auth route group
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/                     # Dashboard route group
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── alerts/
│   │   ├── reports/
│   │   ├── statistics/
│   │   ├── weather/
│   │   └── disastermap/
│   └── page.tsx
│
├── features/                            # Feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── PasswordInput.tsx
│   │   │   ├── RememberMeCheckbox.tsx
│   │   │   └── LoginCard.tsx
│   │   ├── hooks/
│   │   │   ├── useLogin.ts
│   │   │   └── useRememberMe.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   └── types/
│   │       └── auth.types.ts
│   │
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── DashboardOverview.tsx
│   │   │   ├── SummaryCard/
│   │   │   │   ├── SummaryCard.tsx
│   │   │   │   └── SummaryCardSkeleton.tsx
│   │   │   ├── RecentReports/
│   │   │   │   ├── RecentReportsList.tsx
│   │   │   │   ├── RecentReportItem.tsx
│   │   │   │   └── RecentReportEmpty.tsx
│   │   │   └── ActiveAlerts/
│   │   │       ├── AlertsList.tsx
│   │   │       └── AlertItem.tsx
│   │   ├── hooks/
│   │   │   └── useDashboardData.ts
│   │   └── services/
│   │       └── dashboard.service.ts
│   │
│   ├── alerts/
│   │   ├── components/
│   │   │   ├── AlertsPage.tsx
│   │   │   ├── AlertHeader.tsx
│   │   │   ├── AlertList/
│   │   │   │   ├── AlertListItem.tsx
│   │   │   │   └── AlertListEmpty.tsx
│   │   │   ├── AlertDetails/
│   │   │   │   ├── AlertDetailsDialog.tsx
│   │   │   │   └── AlertDetailsContent.tsx
│   │   │   └── ResendAlert/
│   │   │       └── ResendAlertDialog.tsx
│   │   ├── hooks/
│   │   │   └── useAlerts.ts
│   │   └── services/
│   │       └── alert.service.ts
│   │
│   ├── reports/
│   │   ├── components/
│   │   │   ├── ReportsPage.tsx
│   │   │   ├── ReportHeader.tsx
│   │   │   ├── ReportTabs/
│   │   │   │   ├── ReportTabs.tsx
│   │   │   │   ├── ReportCard.tsx
│   │   │   │   └── ReportFilters.tsx
│   │   │   ├── ReportDetails/
│   │   │   │   ├── ReportDetailsDialog.tsx
│   │   │   │   └── ReportDetailsContent.tsx
│   │   │   └── CreateAlert/
│   │   │       └── CreateAlertDialog.tsx
│   │   ├── hooks/
│   │   │   └── useReports.ts
│   │   └── services/
│   │       └── report.service.ts
│   │
│   ├── statistics/
│   │   ├── components/
│   │   │   ├── StatisticsPage.tsx
│   │   │   ├── Charts/
│   │   │   │   ├── TemperatureChart.tsx
│   │   │   │   ├── RainfallChart.tsx
│   │   │   │   ├── HumidityChart.tsx
│   │   │   │   └── ChartWrapper.tsx
│   │   │   ├── ReportGenerator/
│   │   │   │   ├── StatisticReportDialog.tsx
│   │   │   │   ├── ReportConfigForm.tsx
│   │   │   │   ├── MetricsSelector.tsx
│   │   │   │   ├── DateRangeSelector.tsx
│   │   │   │   └── RegionSelector.tsx
│   │   │   └── PrintableReport/
│   │   │       └── PrintableStatisticReport.tsx
│   │   └── hooks/
│   │       └── useStatistics.ts
│   │
│   ├── weather/
│   │   ├── components/
│   │   │   ├── WeatherDetailsPage.tsx
│   │   │   ├── WeatherSearch/
│   │   │   │   ├── LocationSearch.tsx
│   │   │   │   ├── AddressSearch.tsx
│   │   │   │   └── CoordinatesSearch.tsx
│   │   │   ├── WeatherMetrics/
│   │   │   │   ├── MetricsGrid.tsx
│   │   │   │   ├── MetricCard.tsx
│   │   │   │   └── SunTimes.tsx
│   │   │   └── HourlyForecast/
│   │   │       ├── ForecastTabs.tsx
│   │   │       ├── ForecastChart.tsx
│   │   │       └── ForecastSummary.tsx
│   │   ├── hooks/
│   │   │   └── useWeatherData.ts
│   │   └── services/
│   │       └── weather.service.ts
│   │
│   └── disastermap/
│       ├── components/
│       │   └── DisasterMap.tsx
│       └── hooks/
│           └── useDisasterData.ts
│
├── components/                          # Shared components
│   ├── layouts/
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   ├── Logo.tsx
│   │   │   ├── MenuToggle.tsx
│   │   │   ├── NotificationButton.tsx
│   │   │   └── UserMenu/
│   │   │       ├── UserMenu.tsx
│   │   │       ├── UserAvatar.tsx
│   │   │       └── UserMenuDropdown.tsx
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── NavigationItem.tsx
│   │   │   └── NavigationGroup.tsx
│   │   └── DashboardLayout/
│   │       └── DashboardLayout.tsx
│   │
│   ├── ui/                              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   └── shared/                          # Custom shared components
│       ├── LoadingSpinner/
│       │   ├── LoadingSpinner.tsx
│       │   └── PageLoader.tsx
│       ├── ErrorBoundary/
│       │   ├── ErrorBoundary.tsx
│       │   └── ErrorMessage.tsx
│       ├── EmptyState/
│       │   └── EmptyState.tsx
│       ├── PageHeader/
│       │   ├── PageHeader.tsx
│       │   └── PageTitle.tsx
│       └── DataTable/
│           ├── DataTable.tsx
│           └── DataTablePagination.tsx
│
├── lib/                                 # Utilities & configs
│   ├── utils.ts
│   ├── constants.ts
│   └── config/
│       └── app.config.ts
│
├── hooks/                               # Global hooks
│   ├── useAuth.ts
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useMediaQuery.ts
│
├── services/                            # API services
│   ├── api/
│   │   ├── client.ts
│   │   └── endpoints.ts
│   └── interceptors/
│       └── auth.interceptor.ts
│
├── context/                             # React Context
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
│
├── types/                               # Global types
│   ├── index.ts
│   └── api.types.ts
│
└── utils/                               # Helper functions
    ├── format.ts
    ├── validation.ts
    └── date.ts
```

## 🔧 Chi tiết refactoring

### 1. Header Component

**Hiện tại:** Một file lớn 100+ lines

**Sau refactoring:**

```
components/layouts/Header/
├── Header.tsx                    # Main container
├── Logo.tsx                      # Logo component
├── MenuToggle.tsx               # Hamburger menu button
├── NotificationButton.tsx       # Notifications
└── UserMenu/
    ├── UserMenu.tsx             # User menu container
    ├── UserAvatar.tsx           # Avatar display
    └── UserMenuDropdown.tsx     # Dropdown menu
```

### 2. Sidebar Component

**Hiện tại:** Navigation logic lẫn với UI

**Sau refactoring:**

```
components/layouts/Sidebar/
├── Sidebar.tsx           # Main container
├── Navigation.tsx        # Navigation logic
├── NavigationItem.tsx   # Single menu item
└── NavigationGroup.tsx  # Grouped items
```

### 3. Login Form

**Hiện tại:** Monolithic component 150+ lines

**Sau refactoring:**

```
features/auth/components/
├── LoginForm.tsx           # Main form container
├── PasswordInput.tsx       # Password field with toggle
├── RememberMeCheckbox.tsx # Remember me functionality
└── LoginCard.tsx          # Card wrapper
```

### 4. Dashboard Components

**Sau refactoring:**

```
features/dashboard/components/
├── DashboardOverview.tsx
├── SummaryCard/
│   ├── SummaryCard.tsx
│   └── SummaryCardSkeleton.tsx
├── RecentReports/
│   ├── RecentReportsList.tsx
│   ├── RecentReportItem.tsx
│   └── RecentReportEmpty.tsx
└── ActiveAlerts/
    ├── AlertsList.tsx
    └── AlertItem.tsx
```

### 5. Statistics Components

**Sau refactoring:**

```
features/statistics/components/
├── StatisticsPage.tsx
├── Charts/
│   ├── TemperatureChart.tsx
│   ├── RainfallChart.tsx
│   ├── HumidityChart.tsx
│   └── ChartWrapper.tsx (DRY for chart config)
├── ReportGenerator/
│   ├── StatisticReportDialog.tsx
│   ├── ReportConfigForm.tsx
│   ├── MetricsSelector.tsx
│   ├── DateRangeSelector.tsx
│   └── RegionSelector.tsx
└── PrintableReport/
    └── PrintableStatisticReport.tsx
```

### 6. Weather Components

**Sau refactoring:**

```
features/weather/components/
├── WeatherDetailsPage.tsx
├── WeatherSearch/
│   ├── LocationSearch.tsx
│   ├── AddressSearch.tsx
│   └── CoordinatesSearch.tsx
├── WeatherMetrics/
│   ├── MetricsGrid.tsx
│   ├── MetricCard.tsx
│   └── SunTimes.tsx
└── HourlyForecast/
    ├── ForecastTabs.tsx
    ├── ForecastChart.tsx
    └── ForecastSummary.tsx
```

### 7. Shared Components (Mới)

```
components/shared/
├── LoadingSpinner/
│   ├── LoadingSpinner.tsx      # Spinner cơ bản
│   └── PageLoader.tsx           # Full page loader
├── ErrorBoundary/
│   ├── ErrorBoundary.tsx       # Error boundary HOC
│   └── ErrorMessage.tsx         # Error display
├── EmptyState/
│   └── EmptyState.tsx          # Empty state display
├── PageHeader/
│   ├── PageHeader.tsx          # Page header container
│   └── PageTitle.tsx           # Page title
└── DataTable/
    ├── DataTable.tsx           # Reusable table
    └── DataTablePagination.tsx # Pagination
```

## 📐 Nguyên tắc thiết kế

### 1. Single Responsibility Principle

- Mỗi component chỉ làm một việc
- Logic tách biệt khỏi UI

### 2. Component Composition

- Xây dựng component phức tạp từ component nhỏ
- Dễ test và maintain

### 3. Props Interface

- Mỗi component có interface rõ ràng
- TypeScript strict mode

### 4. Custom Hooks

- Tách logic ra khỏi component
- Tái sử dụng logic giữa các component

### 5. Feature-Based Organization

- Group theo tính năng, không theo loại file
- Dễ tìm và maintain

## 🚀 Lợi ích

1. **Maintainability** ⬆️
   - Code dễ đọc và hiểu
   - Dễ tìm bug và fix

2. **Reusability** ⬆️
   - Component nhỏ, tái sử dụng được
   - Giảm code duplication

3. **Testability** ⬆️
   - Component nhỏ dễ test
   - Mock dependencies dễ dàng

4. **Scalability** ⬆️
   - Thêm feature mới không ảnh hưởng code cũ
   - Team work hiệu quả hơn

5. **Performance** ⬆️
   - Code splitting tốt hơn
   - Lazy loading components

## 📝 Migration Strategy

### Phase 1: Shared Components

1. Tạo LoadingSpinner, ErrorMessage, EmptyState
2. Tạo PageHeader component
3. Test và verify

### Phase 2: Layout Components

1. Refactor Header
2. Refactor Sidebar
3. Tạo DashboardLayout wrapper

### Phase 3: Feature Components

1. Auth feature
2. Dashboard feature
3. Alerts feature
4. Reports feature
5. Statistics feature
6. Weather feature

### Phase 4: Optimization

1. Code splitting
2. Lazy loading
3. Performance monitoring

## 🧪 Testing Strategy

1. **Unit Tests**: Mỗi component nhỏ
2. **Integration Tests**: Feature modules
3. **E2E Tests**: User flows

## 📚 Best Practices

1. **Naming Conventions**
   - Components: PascalCase
   - Files: PascalCase for components, camelCase for utilities
   - Props interfaces: ComponentNameProps

2. **File Organization**
   - Index files for exports
   - Co-locate related files

3. **Type Safety**
   - Strict TypeScript
   - No `any` types
   - Proper prop types

4. **Performance**
   - Use React.memo for expensive components
   - useMemo and useCallback appropriately
   - Lazy load heavy components

5. **Accessibility**
   - Semantic HTML
   - ARIA labels
   - Keyboard navigation

## 🎯 Success Metrics

- [ ] Giảm average component size xuống < 150 lines
- [ ] Tăng code reusability lên 40%
- [ ] Giảm code duplication xuống 20%
- [ ] 100% components có TypeScript types
- [ ] 80% test coverage
- [ ] Improved Lighthouse scores

## 📅 Timeline

- **Week 1**: Phase 1 - Shared Components
- **Week 2**: Phase 2 - Layout Components
- **Week 3-4**: Phase 3 - Feature Components
- **Week 5**: Phase 4 - Optimization & Testing

---

**Lưu ý**: Đây là kế hoạch ban đầu và có thể điều chỉnh dựa trên feedback và requirements thực tế.
