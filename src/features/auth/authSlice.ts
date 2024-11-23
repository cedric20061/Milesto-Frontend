import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  updateProfile as updateProfileApi,
  deleteAccount as deleteAccountApi,
  passwordForgotten as passwordForgottenAPI,
} from "@/api/authApi";
import { UserInterface } from "@/types";

// Interface combinée pour l'état global
interface AuthUserState {
  isAuthenticated: boolean;
  user: UserInterface | null;
  error: string | null;
  loading: boolean;
}

// Fonction pour initialiser l'état d'authentification
const getInitialAuthState = (): boolean => {
  const token = Cookies.get("token");
  return !!token;
};

const initialState: AuthUserState = {
  isAuthenticated: getInitialAuthState(),
  user: null,
  error: null,
  loading: false,
};
// Thunk pour la connexion
export const loginUser = createAsyncThunk(
  "authUser/loginUser",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await loginApi(email, password);
      Cookies.set("token", data.token, { expires: 7 });
      return data.user;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to login");
      }
    }
  }
);

// Thunk pour l'enregistrement
export const registerUser = createAsyncThunk(
  "authUser/registerUser",
  async (
    {
      email,
      password,
      name,
    }: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await registerApi(email, password, name);
      Cookies.set("token", data.token, { expires: 7 });
      return data.user;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to register");
      }
    }
  }
);

// Thunk pour la déconnexion
export const logoutUser = createAsyncThunk(
  "authUser/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      Cookies.remove("token");
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to logout");
      }
    }
  }
);
// Thunk pour récupérer les informations utilisateur
export const fetchUserInfo = createAsyncThunk<
  { message: string; user: UserInterface } | undefined,
  void,
  { rejectValue: string }
>("authUser/fetchUserInfo", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_API_URL}/profile`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        credentials: "include",
      }
    );

    if (response.status === 401) {
      // Token expiré ou invalide, déconnecter l'utilisateur
      logoutUser();
      throw new Error("Session expired. Please log in again.");
    }

    const data: { message: string; user: UserInterface } =
      await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Failed to fetch user info");
    }
  }
});

// Thunk pour mettre à jour le profil utilisateur
export const updateUserProfile = createAsyncThunk<
  UserInterface,
  Partial<UserInterface>,
  { rejectValue: string }
>("authUser/updateUserProfile", async (updatedData, { rejectWithValue }) => {
  try {
    const data = await updateProfileApi(updatedData);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  }
});

export const passwordForgotten = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: string }
>("authUser/passwordForgotten", async (email, { rejectWithValue }) => {
  try {
    const data = await passwordForgottenAPI(email);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Failed to reset password");
    }
  }
});

// Thunk pour supprimer le compte utilisateur
export const deleteUserAccount = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("authUser/deleteUserAccount", async (_, { rejectWithValue }) => {
  try {
    await deleteAccountApi();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message || "Failed to delete account");
    }
  }
});

// Slice combiné
const authUserSlice = createSlice({
  name: "authUser",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Reducers pour login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<UserInterface>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserInfo.fulfilled,
        (
          state,
          action: PayloadAction<
            { message: string; user: UserInterface } | undefined
          >
        ) => {
          state.loading = false;
          state.isAuthenticated = true;

          if (action.payload) {
            state.user = action.payload.user;
          } else {
            state.user = null; // ou une valeur par défaut
          }
        }
      )
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      // Reducers pour register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<UserInterface>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })

      // Reducers pour logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(passwordForgotten.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(passwordForgotten.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(passwordForgotten.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload as string;
      })
      // Reducers pour updateProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = JSON.parse(action.payload as string);
      })

      // Reducers pour deleteAccount
      .addCase(deleteUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authUserSlice.actions;
export default authUserSlice.reducer;
