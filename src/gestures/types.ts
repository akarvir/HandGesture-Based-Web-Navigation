export type Landmark = { x: number; y: number; z: number }

export type Gesture =
  | { type: 'point_up' }
  | { type: 'point_down' }
  | { type: 'fist' }
  | { type: 'none' }

export type HandLabel = 'Left' | 'Right' | 'Unknown'
