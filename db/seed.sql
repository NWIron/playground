-- Seed data for devices
INSERT INTO devices (id, name, model, status, location, metadata) VALUES
('1', '温度传感器 A1', 'TS-100', 'online', '仓库 A', '{"unit":"C"}'),
('2', '压力传感器 B3', 'PS-200', 'offline', '生产线 2', '{}'),
('3', '电机控制器 C7', 'MC-900', 'maintenance', '装配区', '{}');
