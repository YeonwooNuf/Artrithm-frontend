export const getLayoutConfig = (theme) => {
  switch (theme) {
    case "modern":
      return {
        galleryModelPath: "/models/vr_art_gallery_01.glb",
        environment: "night",
        playerStart: [-17, 2, 0],
        getPosition: (index) => {
          const isRightWall = index % 2 === 0;
          const gap = 7;
          const baseX = Math.floor(index / 2) * gap;
          return {
            position: [baseX - 10, 2, isRightWall ? 12 : -12],
            rotation: [0, isRightWall ? Math.PI : 0, 0],
          };
        },
        getFocusTransform: () => ({
          position: [7.5, 3, 0],
          rotation: [0, -Math.PI / 2, 0],
        }),
        focusScale: 16,
      };

    case "circle":
      return {
        galleryModelPath: "/models/art_gallery.glb",
        environment: "sunset",
        playerStart: [0, 0.8, -12],

        getPosition: (index, total) => {
          if (total <= 6) {
            // 작품 수가 6개 이하일 때: 바깥쪽 12칸 중 1칸 건너뛰기
            const radius = 16.3;
            const slotIndex = (index * 2) % 12; // 한 칸씩 건너뛰어 배치
            const angle = (slotIndex / 12) * 2 * Math.PI;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            const y = 3.5;
            return {
              position: [x, y, z],
              rotation: [0, angle + Math.PI, 0],
            };
          } else {
            if (index < 6) {
              // 바깥쪽 6개 먼저 배치
              const radius = 16;
              const slotIndex = index * 2;
              const angle = (slotIndex / 12) * 2 * Math.PI;
              const x = Math.sin(angle) * radius;
              const z = Math.cos(angle) * radius;
              const y = 3.5;
              return {
                position: [x+1.5, y, z],
                rotation: [0, angle + Math.PI, 0],
              };
            } else {
              // 7개 이상부터 중심 안쪽 4방향 분배
              const centerIndex = index - 6;
              const radius = 7; // 중심 쪽 반지름 (더 가까움)
              const angle = (centerIndex / 4) * 2 * Math.PI;
              const x = Math.sin(angle) * radius;
              const z = Math.cos(angle) * radius;
              const y = 3.5;
              return {
                position: [x, y, z],
                rotation: [0, angle + Math.PI, 0],
              };
            }
          }
        },

        getFocusTransform: () => ({
          position: [0, 3, 0],
          rotation: [0, 0, 0],
        }),

        focusScale: 8,
      };

    default:
      throw new Error(`Unknown theme: ${theme}`);
  }
};
