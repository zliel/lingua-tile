import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { usePWAInstall } from "./usePWAInstall";

describe("usePWAInstall Hook", () => {
  it("initializes as not installable", () => {
    const { result } = renderHook(() => usePWAInstall());
    expect(result.current.isInstallable).toBe(false);
  });

  it("becomes installable when beforeinstallprompt fires", () => {
    const { result } = renderHook(() => usePWAInstall());

    const event = new Event("beforeinstallprompt");
    // @ts-ignore
    event.prompt = () => Promise.resolve();
    // @ts-ignore
    event.userChoice = Promise.resolve({ outcome: "accepted" });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(result.current.isInstallable).toBe(true);
  });

  it("promptInstall calls prompt on the event", async () => {
    const { result } = renderHook(() => usePWAInstall());

    const mockPrompt = () => Promise.resolve(); // Returning Promise<void>
    // @ts-ignore
    const event: any = new Event("beforeinstallprompt");
    event.prompt = mockPrompt;
    event.userChoice = Promise.resolve({ outcome: "accepted" });

    // Spy on prompt
    const promptSpy = vi.spyOn(event, "prompt");

    act(() => {
      window.dispatchEvent(event);
    });

    await act(async () => {
      await result.current.promptInstall();
    });

    expect(promptSpy).toHaveBeenCalled();
    expect(result.current.isInstallable).toBe(false);
  });
});
