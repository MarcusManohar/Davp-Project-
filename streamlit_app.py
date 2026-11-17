"""
World Travel Dataset - Streamlit Analytics Dashboard
===================================================
Run with:
    pip install streamlit pandas plotly
    streamlit run streamlit_app.py
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# Set page config
st.set_page_config(
    page_title="World Travel Dataset Dashboard",
    page_icon="🌍",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Load dataset
@st.cache_data
def load_data():
    return pd.read_csv("public/assets/aistudio/world_travel_dataset_e8459e94.csv")

df = load_data()

# Sidebar Navigation & Filters
st.sidebar.title("🌍 World Travel Atlas")
st.sidebar.markdown("Analytics dashboard across **942 verified traveler profiles**.")

continent_list = ["All"] + sorted(df["Continent"].unique().tolist())
selected_continent = st.sidebar.selectbox("Filter by Continent", continent_list)

filtered_df = df if selected_continent == "All" else df[df["Continent"] == selected_continent]

# Navigation View
view = st.sidebar.radio(
    "Select View",
    ["Overview Dashboard", "Global Map", "Dataset Grid (942)", "Destination Deep-Dive", "Trip Budget Calculator"]
)

# 1. OVERVIEW DASHBOARD
if view == "Overview Dashboard":
    st.title("World Travel Dataset Analysis & Intelligence")
    st.markdown("Analytical breakdown of 942 verified travel profiles across 157 global destinations.")

    # KPI Metrics
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Total Records", len(filtered_df), f"{filtered_df['Destination'].nunique()} cities")
    with col2:
        st.metric("Avg Daily Budget", f"${filtered_df['Estimated_Daily_Budget_USD'].mean():.0f}", f"Range ${filtered_df['Estimated_Daily_Budget_USD'].min():.0f}-${filtered_df['Estimated_Daily_Budget_USD'].max():.0f}")
    with col3:
        st.metric("Avg Traveler Rating", f"{filtered_df['Average_Traveler_Rating'].mean():.2f} ★", "Out of 5.0")
    with col4:
        st.metric("Avg Recommended Stay", f"{filtered_df['Recommended_Days'].mean():.1f} days", f"Avg Trip ${filtered_df['Estimated_Trip_Budget_USD'].mean():.0f}")

    st.markdown("---")

    # Chart Row 1: Continent Economics & Trip Types
    c1, c2 = st.columns(2)
    with c1:
        st.subheader("Regional Economics by Continent")
        cont_agg = df.groupby("Continent")["Estimated_Daily_Budget_USD"].mean().reset_index()
        fig_cont = px.bar(cont_agg, x="Continent", y="Estimated_Daily_Budget_USD", color="Continent", text_auto=".0f")
        fig_cont.update_layout(showlegend=False, yaxis_title="Avg Daily Budget ($ USD)")
        st.plotly_chart(fig_cont, use_container_width=True)

    with c2:
        st.subheader("Travel Style Comparison")
        style_agg = df.groupby("Trip_Type")[["Estimated_Daily_Budget_USD", "Average_Traveler_Rating"]].mean().reset_index()
        fig_style = px.bar(style_agg, x="Trip_Type", y="Estimated_Daily_Budget_USD", color="Trip_Type", text_auto=".0f")
        fig_style.update_layout(showlegend=False, yaxis_title="Avg Daily Budget ($ USD)")
        st.plotly_chart(fig_style, use_container_width=True)

    # Chart Row 2: Scatter Correlation
    st.subheader("Daily Budget vs Traveler Rating Correlation")
    fig_scatter = px.scatter(
        filtered_df,
        x="Estimated_Daily_Budget_USD",
        y="Average_Traveler_Rating",
        color="Continent",
        hover_name="Destination",
        hover_data=["Country", "Trip_Type", "Recommended_Days"],
        labels={"Estimated_Daily_Budget_USD": "Estimated Daily Budget ($)", "Average_Traveler_Rating": "Traveler Rating (★)"}
    )
    st.plotly_chart(fig_scatter, use_container_width=True)

# 2. GLOBAL MAP
elif view == "Global Map":
    st.title("Geographic Destination Cartography")
    st.markdown("157 global destinations mapped with precise latitude and longitude coordinates.")

    dest_agg = filtered_df.groupby(["Destination", "Country", "Continent", "Latitude", "Longitude"]).agg(
        Avg_Daily_Budget=("Estimated_Daily_Budget_USD", "mean"),
        Avg_Rating=("Average_Traveler_Rating", "mean")
    ).reset_index()

    fig_map = px.scatter_geo(
        dest_agg,
        lat="Latitude",
        lon="Longitude",
        color="Continent",
        hover_name="Destination",
        hover_data={"Country": True, "Avg_Daily_Budget": ":$.0f", "Avg_Rating": ":.2f", "Latitude": False, "Longitude": False},
        size="Avg_Daily_Budget",
        projection="natural earth"
    )
    fig_map.update_layout(height=600, margin={"r": 0, "t": 0, "l": 0, "b": 0})
    st.plotly_chart(fig_map, use_container_width=True)

# 3. DATASET GRID
elif view == "Dataset Grid (942)":
    st.title("World Travel Dataset Catalog (942 Records)")
    search_q = st.text_input("Search city, country, or ID:")
    if search_q:
        table_df = filtered_df[
            filtered_df["Destination"].str.contains(search_q, case=False, na=False) |
            filtered_df["Country"].str.contains(search_q, case=False, na=False) |
            filtered_df["Travel_Profile_ID"].str.contains(search_q, case=False, na=False)
        ]
    else:
        table_df = filtered_df

    st.dataframe(table_df, use_container_width=True)
    st.download_button("Download Filtered CSV", table_df.to_csv(index=False), "world_travel_dataset_export.csv", "text/csv")

# 4. DESTINATION DEEP DIVE
elif view == "Destination Deep-Dive":
    st.title("Destination Profile Inspection")
    selected_city = st.selectbox("Select City", sorted(df["Destination"].unique().tolist()))
    city_profiles = df[df["Destination"] == selected_city]

    first_row = city_profiles.iloc[0]
    st.markdown(f"**Country**: {first_row['Country']} · **Continent**: {first_row['Continent']} · **Best Season**: {first_row['Best_Season']}")

    st.subheader(f"All 6 Travel Profiles for {selected_city}")
    st.table(city_profiles[[
        "Trip_Type", "Estimated_Daily_Budget_USD", "Estimated_Trip_Budget_USD",
        "Average_Traveler_Rating", "Typical_Transport", "Estimated_Hotel_Per_Night_USD",
        "Estimated_Food_Per_Day_USD", "Estimated_Local_Transport_Per_Day_USD"
    ]])

# 5. TRIP BUDGET CALCULATOR
elif view == "Trip Budget Calculator":
    st.title("Trip Budget Calculator & Planner")
    calc_city = st.selectbox("Choose Destination", sorted(df["Destination"].unique().tolist()))
    calc_type = st.selectbox("Choose Travel Style", sorted(df["Trip_Type"].unique().tolist()))
    rec = df[(df["Destination"] == calc_city) & (df["Trip_Type"] == calc_type)].iloc[0]

    days = st.slider("Trip Duration (Days)", 1, 21, int(rec["Recommended_Days"]))
    travelers = st.slider("Number of Travelers", 1, 6, 1)

    daily = rec["Estimated_Daily_Budget_USD"]
    hotel = rec["Estimated_Hotel_Per_Night_USD"]
    food = rec["Estimated_Food_Per_Day_USD"]
    transit = rec["Estimated_Local_Transport_Per_Day_USD"]
    misc = max(0, daily - (hotel + food + transit))

    total = daily * days * travelers

    st.success(f"### Estimated Trip Total: ${total:,.0f} USD")
    st.markdown(f"Daily rate: **${daily:.0f}/person/day** · Typical Transit: **{rec['Typical_Transport']}** · Best Season: **{rec['Best_Season']}**")

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Accommodation", f"${hotel * days:,.0f}")
    c2.metric("Food & Dining", f"${food * days * travelers:,.0f}")
    c3.metric("Local Transit", f"${transit * days * travelers:,.0f}")
    c4.metric("Activities & Misc", f"${misc * days * travelers:,.0f}")
