/// <reference types="vitest/globals" />
import { act, renderHook, waitFor } from "@testing-library/react";
import { useLocalStorage } from "../src";

describe("useLocalStorage", () => {
  test("should set and get string value", async () => {
    const { result } = renderHook(() => useLocalStorage("test"));

    act(() => {
      result.current[1]("value");
    });

    await waitFor(() => {
      expect(result.current[0]).toBe("value");
    });
  });

  test("should set and get object value", async () => {
    const { result } = renderHook(() => useLocalStorage("test", { a: 1 }));

    act(() => {
      result.current[1]({ a: 2 });
    });

    await waitFor(() => {
      expect(result.current[0]).toEqual({ a: 2 });
    });
  });

  test("should set and get array value", async () => {
    const { result } = renderHook(() => useLocalStorage("test", [1, 2, 3]));

    act(() => {
      result.current[1]([1, 2, 3, 4]);
    });

    await waitFor(() => {
      expect(result.current[0]).toEqual([1, 2, 3, 4]);
    });
  });

  test("should set and get int value", async () => {
    const { result } = renderHook(() => useLocalStorage("test", 1));

    act(() => {
      result.current[1](2);
    });

    await waitFor(() => {
      expect(result.current[0]).toBe(2);
    });
  });

  test("should set and get float value", async () => {
    const { result } = renderHook(() => useLocalStorage("test", 1.1));

    act(() => {
      result.current[1](2.2);
    });

    await waitFor(() => {
      expect(result.current[0]).toBe(2.2);
    });
  });

  test("should set and get boolean value", async () => {
    const { result } = renderHook(() => useLocalStorage("test", true));

    act(() => {
      result.current[1](false);
    });

    await waitFor(() => {
      expect(result.current[0]).toBe(false);
    });
  });

  test("should set and get date value", async () => {
    const { result } = renderHook(() => useLocalStorage("test", new Date()));

    act(() => {
      result.current[1](new Date(2021, 1, 1));
    });

    await waitFor(() => {
      expect(result.current[0]).toEqual(new Date(2021, 1, 1));
    });
  });

  test("should set and get null value", async () => {
    const { result } = renderHook(() => useLocalStorage("test", null));

    act(() => {
      result.current[1](null);
    });

    await waitFor(() => {
      expect(result.current[0]).toBeNull();
    });
  });

  test("should set and get undefined value", async () => {
    const { result } = renderHook(() => useLocalStorage("test", undefined));

    act(() => {
      result.current[1](undefined);
    });

    await waitFor(() => {
      expect(result.current[0]).toBeUndefined();
    });
  });

  test("should clear value", async () => {
    const { result } = renderHook(() => useLocalStorage("test2", "value"));

    await waitFor(() => {
      expect(result.current[0]).toBe("value");
    });

    act(() => {
      result.current[2]();
    });

    await waitFor(() => {
      expect(result.current[0]).toBeUndefined();
    });
  });
});
