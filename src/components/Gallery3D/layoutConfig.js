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
        focusScale: 2.5,
      };

    case "circle":
      return {
        galleryModelPath: "/models/art_gallery.glb",
        environment: "city",
        playerStart: [0, 0.8, -12],
        getPosition: (index, total) => {
          const totalSlots = 12;
          const outerRadius = 16.2;
          const angle = (index / totalSlots) * 2 * Math.PI + 0.09;
          const x = Math.sin(angle) * outerRadius;
          const z = Math.cos(angle) * outerRadius;
          const y = 3.5;
          return {
            position: [x, y, z],
            rotation: [0, angle + Math.PI, 0],
          };
        },
        getFocusTransform: () => ({
          position: [0, 3, 0],
          rotation: [0, 0, 0],
        }),
        focusScale: 2,
      };

    case "masterpiece":
      return {
        galleryModelPath: "/models/dark_room.glb",
        environment: "sunset",
        playerStart: [110, 5, 85],
        modelOffset: [0, 3, 0], // 모델 y축 위치 보정
        getPosition: (index, total) => {
          const spacing = 15;
          const isFrontWall = index < total / 2;

          const x = (index % (total / 2)) * spacing - ((spacing * (total / 2 - 1)) / 2);
          const y = 5;
          const z = isFrontWall ? 53.5 : 53.5 + 57.5;

          return {
            position: [x + 130, y, z],
            rotation: [0, isFrontWall ? 0 : Math.PI, 0], // 뒤쪽 벽은 반대로 회전
          };
        },
        getFocusTransform: () => ({
          position: [0, 2.5, 5],
          rotation: [0, Math.PI, 0],
        }),
        focusScale: 2.3,
      };


    default:
      throw new Error(`Unknown theme: ${theme}`);
  }
};